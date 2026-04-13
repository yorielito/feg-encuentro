import {
  collection,
  doc,
  getDocs,
  increment,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export type PublicPrayerRegistrationPayload = {
  eventId: string;
  slotId: string;
  fullName: string;
  email?: string;
  phone?: string;
  notes?: string;
};

function normalizeEmail(value?: string) {
  return (value || "").trim().toLowerCase();
}

function normalizePhone(value?: string) {
  return (value || "").replace(/\s+/g, "").replace(/[-()]/g, "").trim();
}

export async function createPrayerRegistration(
  payload: PublicPrayerRegistrationPayload
): Promise<void> {
  const normalizedEmail = normalizeEmail(payload.email);
  const normalizedPhone = normalizePhone(payload.phone);

  if (!normalizedEmail && !normalizedPhone) {
    throw new Error("Debes indicar al menos un email o un teléfono.");
  }

  const registrationsRef = collection(db, "eventRegistrations");

  const duplicateQuery = query(
    registrationsRef,
    where("eventId", "==", payload.eventId),
    where("slotId", "==", payload.slotId),
    where("type", "==", "prayer")
  );

  const duplicateSnap = await getDocs(duplicateQuery);

  const alreadyExists = duplicateSnap.docs.some((docSnap) => {
    const data = docSnap.data() as {
      email?: string;
      phone?: string;
    };

    const savedEmail = normalizeEmail(data.email);
    const savedPhone = normalizePhone(data.phone);

    return (
      (normalizedEmail && savedEmail === normalizedEmail) ||
      (normalizedPhone && savedPhone === normalizedPhone)
    );
  });

  if (alreadyExists) {
    throw new Error(
      "Ya existe una reserva para este horario con ese email o teléfono."
    );
  }

  const slotRef = doc(
    db,
    "prayerEvents",
    payload.eventId,
    "slots",
    payload.slotId
  );

  await runTransaction(db, async (transaction) => {
    const slotSnap = await transaction.get(slotRef);

    if (!slotSnap.exists()) {
      throw new Error("El horario seleccionado ya no está disponible.");
    }

    const slotData = slotSnap.data() as {
      capacity: number;
      reservedCount: number;
      isAvailable: boolean;
    };

    if (!slotData.isAvailable) {
      throw new Error("Este horario no está disponible.");
    }

    if (slotData.reservedCount >= slotData.capacity) {
      throw new Error("Este horario ya está lleno.");
    }

    const registrationRef = doc(registrationsRef);

    transaction.set(registrationRef, {
      eventId: payload.eventId,
      slotId: payload.slotId,
      type: "prayer",
      fullName: payload.fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      notes: (payload.notes || "").trim(),
      createdAt: new Date().toISOString(),
      attendanceStatus: "pending",
    });

    transaction.update(slotRef, {
      reservedCount: increment(1),
      updatedAt: new Date().toISOString(),
    });
  });
}
