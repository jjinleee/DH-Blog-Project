import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (name.length < 2) {
      return NextResponse.json({ message: '닉네임은 2자 이상이어야 합니다.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"<>,.?~\\/-]).{8,}$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: '유효한 이메일 형식을 입력해주세요.' }, { status: 400 });
    }

    if (!passwordRegex.test(password)) {
      return NextResponse.json({ message: '비밀번호는 영문, 숫자, 특수기호 포함 8자 이상이어야 합니다.' }, { status: 400 });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ message: '이미 존재하는 이메일입니다.' }, { status: 409 });
    }

    const existingName = await prisma.user.findFirst({ where: { name } });
    if (existingName) {
      return NextResponse.json({ message: '이미 존재하는 닉네임입니다.' }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER',
      },
    });

    return NextResponse.json({ message: 'User registered', user: newUser });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}