import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const targetUrl: string | null = req.nextUrl.searchParams.get("url"); // The external API URL

  // const response = await fetch(targetUrl, {
  //   method: "GET",
  //   headers: {
  //     // 'Authorization': 'Bearer YOUR_API_KEY',
  //     "Content-Type": "application/json",
  //   },
  // });
  if (!targetUrl) {
    return NextResponse.json({message: "URL Parameter is required"}, { status: 400})
  }

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        // 'Authorization': 'Bearer YOUR_API_KEY',
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: `External API returned error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // SEND DATA
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Or specify a domain for better security
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    })

  } catch (err) {
    console.error("Error fetching from external API:", err);

    // Handle the error gracefully
    return NextResponse.json(
      { message: "Failed to fetch data from external API", error: err.message },
      { status: 500 }
    );
  }

  //const data = await response.json();

  

  //return NextResponse.json({ url: targetUrl })
}

// export async function OPTIONS() {
//   return new Response(null, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
//       "Access-Control-Allow-Headers": "Content-Type, Authorization",
//       "Access-Control-Allow-Credentials": "true",
//     },
//   });
// }
