import {NextResponse} from "next/server";
import {deleteUser, getUserById, updateUser} from "@/lib/data";

export async function GET(request, context) {

    const {params} = context;
    const id = params.id;
    const findId = parseInt(id);

    try {

        if (id < 0) {
            return NextResponse.json({
                    message: "Invalid id"
                },
                {
                    status: 400,
                });
        }

        const user = getUserById(findId);
        if (!user) {
            return NextResponse.json({
                    message: "User not found"
                },
                {status: 404}
            );

        }
        return NextResponse.json(user)
    } catch (e) {
        return NextResponse.json({
            status: "error",
            message: e.message
        });
    }
}

export async function PUT(req, context) {
    const {params} = context;
    const body = await req.json();

    const id = await params.id;
    const findId = parseInt(id);
    try {
        if (id < 0) {
            return NextResponse.json({
                    message: "Invalid id"
                },
                {
                    status: 400
                }
            );
        }
        const updatedUser = updateUser(findId, body)
        if (!updatedUser) {
            return NextResponse.json({
                    message: "User not found"
                },
                {status: 404}
            );
        }
        return NextResponse.json(updatedUser, {status: 200});
    } catch (e) {
        return NextResponse.json({message: e.message}, {status: 400})
    }
}

export async function DELETE(request, context) {
    const {params} = context;
    const id = params.id;
    const findId = parseInt(id);
    try {
        if (id < 0) {
            return NextResponse.json({
                    message: "Invalid id"
                },
                {
                    status: 400
                }
            );
        }
        const user = deleteUser(findId);
        if (!user) {
            return NextResponse.json({
                    message: "User not found"
                },
                {status: 404}
            );
        }
        return NextResponse.json({message: "User deleted"}, {status: 200});
    } catch (e) {
        return NextResponse.json({message: e.message}, {status: 400})
    }
}
