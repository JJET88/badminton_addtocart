import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";


export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;


    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Email and password are required" }), { status: 400 });
    }


    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return new Response(JSON.stringify({ message: "Email already in use" }), { status: 400 });
    }


    const hashed = await bcrypt.hash(password, 10);


    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });


    return new Response(JSON.stringify({ message: "Account created successfully", userId: user.id }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "An error occurred" }), { status: 500 });
  }
}

