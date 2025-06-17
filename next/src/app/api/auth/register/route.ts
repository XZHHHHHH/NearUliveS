import { register } from "../../../lib/controller/authController";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return register(req);
}
