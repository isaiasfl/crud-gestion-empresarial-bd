import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Script de seed para poblar la base de datos con datos iniciales
 * - 2 usuarios de prueba con passwords hasheados
 * - 4 empresas reales del sector tecnológico
 * - 8 contactos reales (CEOs y directivos)
 */
async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Limpiar datos existentes (en orden por las relaciones)
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Datos anteriores eliminados");

  // ========================================
  // USUARIOS DE PRUEBA
  // ========================================
  const demoPassword = await bcrypt.hash("Demo123!", 10);
  const testPassword = await bcrypt.hash("Test123!", 10);

  const user1 = await prisma.user.create({
    data: {
      email: "demo@example.com",
      passwordHash: demoPassword,
      name: "Usuario Demo",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "test@example.com",
      passwordHash: testPassword,
      name: "Usuario Test",
    },
  });

  console.log("✅ Usuarios creados:", user1.email, user2.email);

  // ========================================
  // EMPRESAS REALES
  // ========================================
  const google = await prisma.company.create({
    data: {
      name: "Google",
      industry: "Technology",
      website: "https://google.com",
    },
  });

  const microsoft = await prisma.company.create({
    data: {
      name: "Microsoft",
      industry: "Technology",
      website: "https://microsoft.com",
    },
  });

  const amazon = await prisma.company.create({
    data: {
      name: "Amazon",
      industry: "E-commerce & Cloud Computing",
      website: "https://amazon.com",
    },
  });

  const meta = await prisma.company.create({
    data: {
      name: "Meta",
      industry: "Social Media",
      website: "https://meta.com",
    },
  });

  console.log(
    "✅ Empresas creadas:",
    google.name,
    microsoft.name,
    amazon.name,
    meta.name,
  );

  // ========================================
  // CONTACTOS REALES
  // ========================================

  // Google
  await prisma.contact.create({
    data: {
      firstName: "Sundar",
      lastName: "Pichai",
      email: "sundar.pichai@google.com",
      phone: "+1-650-253-0000",
      position: "CEO",
      companyId: google.id,
      linkedin: "https://linkedin.com/in/sundar-pichai",
      notes: "CEO de Google y Alphabet desde 2019",
    },
  });

  await prisma.contact.create({
    data: {
      firstName: "Ruth",
      lastName: "Porat",
      email: "ruth.porat@google.com",
      phone: "+1-650-253-0001",
      position: "CFO",
      companyId: google.id,
      linkedin: "https://linkedin.com/in/ruth-porat",
      notes: "CFO de Alphabet y Google",
    },
  });

  // Microsoft
  await prisma.contact.create({
    data: {
      firstName: "Satya",
      lastName: "Nadella",
      email: "satya.nadella@microsoft.com",
      phone: "+1-425-882-8080",
      position: "CEO",
      companyId: microsoft.id,
      linkedin: "https://linkedin.com/in/satyanadella",
      notes: "CEO de Microsoft desde 2014",
    },
  });

  await prisma.contact.create({
    data: {
      firstName: "Amy",
      lastName: "Hood",
      email: "amy.hood@microsoft.com",
      phone: "+1-425-882-8081",
      position: "CFO",
      companyId: microsoft.id,
      linkedin: "https://linkedin.com/in/amy-hood",
      notes: "CFO de Microsoft desde 2013",
    },
  });

  // Amazon
  await prisma.contact.create({
    data: {
      firstName: "Andy",
      lastName: "Jassy",
      email: "andy.jassy@amazon.com",
      phone: "+1-206-266-1000",
      position: "CEO",
      companyId: amazon.id,
      linkedin: "https://linkedin.com/in/andy-jassy",
      notes: "CEO de Amazon desde 2021, anteriormente CEO de AWS",
    },
  });

  await prisma.contact.create({
    data: {
      firstName: "Brian",
      lastName: "Olsavsky",
      email: "brian.olsavsky@amazon.com",
      phone: "+1-206-266-1001",
      position: "CFO",
      companyId: amazon.id,
      linkedin: "https://linkedin.com/in/brian-olsavsky",
      notes: "CFO de Amazon",
    },
  });

  // Meta
  await prisma.contact.create({
    data: {
      firstName: "Mark",
      lastName: "Zuckerberg",
      email: "mark.zuckerberg@meta.com",
      phone: "+1-650-543-4800",
      position: "CEO",
      companyId: meta.id,
      linkedin: "https://linkedin.com/in/zuckerberg",
      notes: "CEO y fundador de Meta (anteriormente Facebook)",
    },
  });

  await prisma.contact.create({
    data: {
      firstName: "Susan",
      lastName: "Li",
      email: "susan.li@meta.com",
      phone: "+1-650-543-4801",
      position: "CFO",
      companyId: meta.id,
      linkedin: "https://linkedin.com/in/susan-li",
      notes: "CFO de Meta desde 2022",
    },
  });

  // Contactos sin empresa asignada (para demostrar la relación opcional)
  await prisma.contact.create({
    data: {
      firstName: "Carlos",
      lastName: "Martínez",
      email: "carlos.martinez@freelance.com",
      phone: "+34-600-123-456",
      position: "Freelance Developer",
      linkedin: "https://linkedin.com/in/carlos-martinez",
      notes: "Desarrollador independiente especializado en React y Node.js",
    },
  });

  await prisma.contact.create({
    data: {
      firstName: "Ana",
      lastName: "García",
      email: "ana.garcia@consultant.com",
      phone: "+34-600-789-012",
      position: "Business Consultant",
      linkedin: "https://linkedin.com/in/ana-garcia",
      notes: "Consultora de negocios especializada en transformación digital",
    },
  });

  console.log("✅ Contactos creados (10 en total)");

  console.log("🎉 Seed completado exitosamente!");
  console.log("");
  console.log("📊 Resumen:");
  console.log("   - 2 usuarios de prueba");
  console.log("   - 4 empresas");
  console.log("   - 10 contactos (8 con empresa, 2 freelance)");
  console.log("");
  console.log("🔐 Credenciales de prueba:");
  console.log("   Email: demo@example.com | Password: Demo123!");
  console.log("   Email: test@example.com | Password: Test123!");
}

// Ejecutar el seed y manejar errores
main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
