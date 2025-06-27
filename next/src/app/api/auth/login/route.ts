// Import the custom login logic from the controller (handles DB & password check)
import { login } from "../../../lib/controller/authController";

// Import request/response types from Next.js
import { NextRequest, NextResponse } from "next/server";

// This function handles POST requests to /api/auth/login
export async function POST(req: NextRequest) {
  // Extract email and password from the body of the incoming request
  const { email, password } = await req.json();

  // Call the login function to verify the user's credentials
  const result = await login(email, password);

  // If login is successful:
  if (result.success) {
    // store a success response with message and user info in variable response
    const response = NextResponse.json({
      message : result.message,
      user: result.user,
    });

    // Set a secure HTTP-only cookie that stores the user's email
    // Only the server can access this cookie (httpOnly), and it lasts for 7 days
    return response.cookies.set("userEmail", result.user.email, {
      httpOnly: true,          // Prevents JavaScript access (protects against XSS)
      path: "/",               // Cookie is valid across the whole site
      secure: true,            // Ensures it's only sent over HTTPS (production-safe)
      maxAge: 60 * 60 * 24 * 7 // Duration = 7 days
    });
  }

  // If login fails (wrong email/password):
  else {
    return NextResponse.json(
      // If a specific field caused the error, return it to the frontend
      result.field
        ? { error: result.error, field: result.field }
        : { error: result.error },
      { status: 401 } 
    );
  }
}
