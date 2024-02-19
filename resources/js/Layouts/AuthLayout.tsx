import { PropsWithChildren } from "react";

export default function ({ children }: PropsWithChildren) {
    return (
        <div id="Auth">
            <div>{children}</div>
        </div>
    );
}
