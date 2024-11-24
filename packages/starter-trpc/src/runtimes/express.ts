import { app } from "./app.js";

export function runExpress() {
    app.listen(3000, () => {
        console.log(`Server started on http://localhost:3000`);
    });
}

runExpress();
