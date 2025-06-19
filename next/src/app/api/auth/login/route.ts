import next from "next";
import { login } from "../../../lib/controller/authController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const result = await login(email, password);

  if (result.success) {
    return NextResponse.json({
      message: result.message,
      user: result.user}, 
      {status: 200});
  } else {
      if (result.field) {
        return NextResponse.json({
          error: result.error,
          field:result.field},
          {status: 401});
      } else {
        return NextResponse.json({
          error: result.error},
          {status: 401});
      }
    }
}