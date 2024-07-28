import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { updateUserProfile } from "@/actions";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback?next=/dashboard`,
    },
  });
  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Update user profile
  if(data?.user) {
    await updateUserProfile(data.user.id, name);
  }

  return new NextResponse(JSON.stringify({ data }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
