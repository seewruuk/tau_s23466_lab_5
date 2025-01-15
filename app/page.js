import Image from "next/image";
import React from "react";

const items = [
    {id: 1, type: "GET", name: "/api/users", color: "text-green-500" },
    {id: 2, type: "GET", name: "/api/users/{id}", color: "text-green-500" },
    {id: 3, type: "POST", name: "/api/users", color: "text-yellow-500" },
    {id: 4, type: "PUT", name: "/api/users/{id}", color: "text-blue-500" },
    {id: 5, type: "DELETE", name: "/api/users/{id}", color: "text-red-500" }
    // More items...
]

export default function Home() {
    return (
        <main className="grid h-screen place-items-center bg-gray-100 px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-indigo-600">TAU</p>
                <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                    Laboratorium 5 - API
                </h1>
                <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                    s23466
                </p>
                <div className="mt-10">
                    <ul role="list" className="space-y-3">
                        {items.map((item) => (
                            <li key={item.id}
                                className="overflow-hidden bg-white px-4 py-4 shadow sm:rounded-md sm:px-6 flex justify-between text-sm font-semibold">
                                <span className={`${item.color}`}>{item.type}</span>
                                <span>{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
}
