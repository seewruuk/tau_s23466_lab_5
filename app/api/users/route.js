import {NextResponse} from "next/server";
import {
    addUser,
    getUsers
} from "@/lib/data";


export async function GET(req, res) {
    try {
        return NextResponse.json(getUsers())
    } catch (e) {
        return NextResponse.json({
            status: "error",
            message: e
        });
    }
}

export async function POST(req, res) {
    const body = await req.json();

    try {
        const {email, name} = body;

        if (!email || !name) {
            return NextResponse.json({
                    message: "Name and email are required fields"
                },
                {status: 400}
            );
        }

        const newUser = addUser(body);
        return NextResponse.json(newUser, {status: 201})
    } catch (e) {
        return NextResponse.json({
                message: e.message
            },
            {status: 400}
        );
    }
}