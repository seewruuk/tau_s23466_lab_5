import request from "supertest";
import { createServer } from "http";
import { parse } from "url";
import * as usersRoute from "@/app/api/users/route";
import * as userByIdRoute from "@/app/api/users/[id]/route";

// Funkcja tworząca serwer testowy z obsługą ReadableStream
const createHandlerServer = (handler, method, path, body = null, context = {}) => {
    return createServer(async (req, res) => {
        const parsedUrl = parse(path, true);
        req.query = parsedUrl.query;
        req.method = method;
        req.headers["content-type"] = "application/json";

        // Symulacja `req.json()`
        req.json = async () => JSON.parse(body ? JSON.stringify(body) : "{}");

        const response = await handler(req, { params: context.params });

        // Ustaw nagłówki odpowiedzi
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.writeHead(response.status, { "Content-Type": response.headers.get("content-type") });

        // Obsługa ciała odpowiedzi
        if (response.body instanceof ReadableStream) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let chunk;
            while (!(chunk = await reader.read()).done) {
                res.write(decoder.decode(chunk.value));
            }
            res.end();
        } else {
            res.end(response.body ? JSON.stringify(response.body) : null);
        }
    });
};


describe("API /users", () => {
    it("GET /users - powinno zwrócić listę użytkowników", async () => {
        const server = createHandlerServer(usersRoute.GET, "GET", "/api/users");
        const res = await request(server).get("/api/users");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("GET /users/{id} - powinno zwrócić użytkownika po ID", async () => {
        const server = createHandlerServer(userByIdRoute.GET, "GET", "/api/users/0", null, {
            params: { id: "0" },
        });
        const res = await request(server).get("/api/users/0");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("name", "Jan Kowalski");
    });

    it("GET /users/{id} - powinno zwrócić 404 dla nieistniejącego ID", async () => {
        const server = createHandlerServer(userByIdRoute.GET, "GET", "/api/users/999", null, {
            params: { id: "999" },
        });
        const res = await request(server).get("/api/users/999");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("message", "User not found");
    });

    it("POST /users - powinno utworzyć nowego użytkownika", async () => {
        const server = createHandlerServer(usersRoute.POST, "POST", "/api/users", {
            name: "Nowy Użytkownik",
            email: "nowy@uzytkownik.pl",
        });
        const res = await request(server).post("/api/users").send({
            name: "Nowy Użytkownik",
            email: "nowy@uzytkownik.pl",
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
    });

    it("POST /users - powinno zwrócić 400 dla brakujących danych", async () => {
        const server = createHandlerServer(usersRoute.POST, "POST", "/api/users", {});
        const res = await request(server).post("/api/users").send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "Name and email are required fields");
    });

    it("PUT /users/{id} - powinno zaktualizować użytkownika", async () => {
        const server = createHandlerServer(userByIdRoute.PUT, "PUT", "/api/users/0", {
            name: "Zaktualizowany Jan",
            email: "zaktualizowany@kowalski.pl",
        }, {
            params: { id: "0" },
        });
        const res = await request(server).put("/api/users/0").send({
            name: "Zaktualizowany Jan",
            email: "zaktualizowany@kowalski.pl",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("name", "Zaktualizowany Jan");
    });

    it("PUT /users/{id} - powinno zwrócić 404 dla nieistniejącego ID", async () => {
        const server = createHandlerServer(userByIdRoute.PUT, "PUT", "/api/users/999", {
            name: "Zaktualizowany Użytkownik",
            email: "nowy@uzytkownik.pl",
        }, {
            params: { id: "999" },
        });
        const res = await request(server).put("/api/users/999").send({
            name: "Zaktualizowany Użytkownik",
            email: "nowy@uzytkownik.pl",
        });
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("message", "User not found");
    });

    it("DELETE /users/{id} - powinno usunąć użytkownika", async () => {
        const server = createHandlerServer(userByIdRoute.DELETE, "DELETE", "/api/users/0", null, {
            params: { id: "0" },
        });
        const res = await request(server).delete("/api/users/0");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "User deleted");
    });

    it("DELETE /users/{id} - powinno zwrócić 404 dla nieistniejącego ID", async () => {
        const server = createHandlerServer(userByIdRoute.DELETE, "DELETE", "/api/users/999", null, {
            params: { id: "999" },
        });
        const res = await request(server).delete("/api/users/999");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("message", "User not found");
    });
});
