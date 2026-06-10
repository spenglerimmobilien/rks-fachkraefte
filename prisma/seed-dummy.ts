import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CANDIDATE_COUNT = 35;
const EMPLOYER_COUNT = 35;

const FIRST_NAMES = [
  "Youssef", "Fatima", "Ahmed", "Aicha", "Mohamed", "Khadija", "Omar", "Sanaa",
  "Hassan", "Nadia", "Karim", "Laila", "Rachid", "Zineb", "Amine", "Salma",
  "Mehdi", "Imane", "Bilal", "Houda",
];

const LAST_NAMES = [
  "Benali", "Alaoui", "Idrissi", "Tazi", "Fassi", "Berrada", "Chraibi", "Amrani",
  "Bennani", "Ouazzani", "Sqalli", "Ziani", "Mekouar", "Lahlou", "Bensouda",
];

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakesch", "Fès", "Tanger", "Agadir", "Meknès", "Oujda",
];

const PROFESSIONS = ["nursing", "craft", "it", "gastronomy", "logistics", "construction"];
const GERMAN_LEVELS = ["A1", "A2", "B1", "B2", "C1"];
const APPLICATION_STATUSES = [
  "RECEIVED", "IN_REVIEW", "QUALIFIED", "MATCHING", "PLACED", "VISA", "ARRIVED",
];

const COMPANY_PREFIXES = [
  "Nord", "Rhein", "Bayern", "West", "Süd", "Elbe", "Main", "Ruhr", "Alpen", "Hanse",
];

const COMPANY_SUFFIXES = [
  "Pflege GmbH", "Handwerk AG", "Logistik GmbH", "Gastronomie KG", "Bau GmbH",
  "Technik GmbH", "Service GmbH", "Industrie AG", "Klinik GmbH", "Hotel GmbH",
];

const GERMAN_CITIES = [
  "Essen", "Düsseldorf", "Köln", "Dortmund", "Bochum", "Berlin", "München",
  "Hamburg", "Frankfurt", "Stuttgart", "Bremen", "Hannover",
];

const EMPLOYER_STATUSES = ["PENDING", "APPROVED", "IN_PROGRESS", "FULFILLED"];
const URGENCIES = ["IMMEDIATE", "THREE_MONTHS", "SIX_MONTHS_PLUS"];

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

async function resetDummyData() {
  const deleted = await prisma.user.deleteMany({
    where: {
      OR: [
        { email: { startsWith: "kandidat" } },
        { email: { startsWith: "arbeitgeber" } },
      ],
    },
  });
  if (deleted.count > 0) {
    console.log(`${deleted.count} alte Dummy-Einträge entfernt.`);
  }
}

async function main() {
  const passwordHash = await bcrypt.hash("dummy123", 12);

  const existingCandidates = await prisma.user.count({
    where: { email: { startsWith: "kandidat" } },
  });
  const existingEmployers = await prisma.user.count({
    where: { email: { startsWith: "arbeitgeber" } },
  });

  if (existingCandidates === CANDIDATE_COUNT && existingEmployers === EMPLOYER_COUNT) {
    console.log(`Dummy-Daten bereits korrekt (${CANDIDATE_COUNT} Kunden, ${EMPLOYER_COUNT} Arbeitgeber).`);
    return;
  }

  if (existingCandidates !== CANDIDATE_COUNT || existingEmployers !== EMPLOYER_COUNT) {
    await resetDummyData();
  }

  console.log(`Erstelle ${CANDIDATE_COUNT} Dummy-Kunden...`);

  for (let i = 1; i <= CANDIDATE_COUNT; i++) {
    const firstName = pick(FIRST_NAMES, i);
    const lastName = pick(LAST_NAMES, i * 3);
    const profession = pick(PROFESSIONS, i);
    const status = pick(APPLICATION_STATUSES, i * 7);
    const num = String(i).padStart(4, "0");

    await prisma.user.create({
      data: {
        email: `kandidat${num}@dummy.rks.local`,
        passwordHash,
        role: "CANDIDATE",
        preferredLanguage: pick(["de", "ar", "fr", "en"], i),
        isApproved: true,
        candidateProfile: {
          create: {
            firstName,
            lastName,
            birthDate: `${1985 + (i % 15)}-${String((i % 12) + 1).padStart(2, "0")}-15`,
            nationality: "Marokko",
            city: pick(MOROCCAN_CITIES, i),
            phone: `+2126${String(10000000 + i).slice(-8)}`,
            profession,
            experienceYears: 1 + (i % 12),
            education: "Berufsausbildung",
            institution: "Institut Supérieur de Technologie",
            graduationYear: String(2010 + (i % 10)),
            germanLevel: pick(GERMAN_LEVELS, i),
            hasGermanCert: i % 3 === 0,
            desiredRegion: pick(["NRW", "Bayern", "Berlin", "Hamburg"], i),
            driversLicense: i % 2 === 0,
            motivation: "Motiviert für eine Karriere in Deutschland.",
            applications: {
              create: {
                applicationNumber: `RKS-DUMMY-K${num}`,
                status,
                statusHistory: {
                  create: { status, note: "Dummy-Bewerbung" },
                },
              },
            },
          },
        },
      },
    });
  }

  console.log(`Erstelle ${EMPLOYER_COUNT} Dummy-Arbeitgeber...`);

  for (let i = 1; i <= EMPLOYER_COUNT; i++) {
    const num = String(i).padStart(4, "0");
    const companyName = `${pick(COMPANY_PREFIXES, i)} ${pick(COMPANY_SUFFIXES, i * 2)}`;
    const isApproved = i % 5 !== 0;

    await prisma.user.create({
      data: {
        email: `arbeitgeber${num}@dummy.rks.local`,
        passwordHash,
        role: "EMPLOYER",
        preferredLanguage: "de",
        isApproved,
        employerProfile: {
          create: {
            companyName,
            industry: pick(PROFESSIONS, i),
            location: pick(GERMAN_CITIES, i),
            companySize: pick(["10-50", "50-200", "200-500", "500+"], i),
            contactPerson: `Herr/Frau ${pick(LAST_NAMES, i)}`,
            position: pick(["HR-Leitung", "Geschäftsführung", "Personalreferent"], i),
            phone: `+49${1590000000 + i}`,
            requests: {
              create: {
                requestNumber: `RKS-DUMMY-A${num}`,
                professions: JSON.stringify([pick(PROFESSIONS, i), pick(PROFESSIONS, i + 1)]),
                positions: 1 + (i % 5),
                urgency: pick(URGENCIES, i),
                requirements: "Qualifizierte Fachkraft mit Berufserfahrung und Deutschkenntnissen.",
                contractType: pick(["unbefristet", "befristet"], i),
                salaryRange: `${2500 + (i % 10) * 100}-${3500 + (i % 10) * 100} €`,
                housing: i % 4 === 0,
                status: pick(EMPLOYER_STATUSES, i),
              },
            },
          },
        },
      },
    });
  }

  console.log(`\nFertig! ${CANDIDATE_COUNT} Kunden + ${EMPLOYER_COUNT} Arbeitgeber (10 % des vorherigen Umfangs).`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
