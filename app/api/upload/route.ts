import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const title = formData.get("title");
    const category = formData.get("category");

    console.log("FILE:", file?.name);
    console.log("TITLE:", title);
    console.log("CATEGORY:", category);

    return NextResponse.json({
      message: "Upload berhasil (dummy API)",
      fileName: file?.name,
      title,
      category,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Upload gagal" },
      { status: 500 }
    );
  }
}