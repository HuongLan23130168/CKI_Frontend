import { getPasswordChecks } from "../utils/password";

function PasswordRules({ password }: { password: string }) {
    return (
        <ul className="pw-rules">
            {getPasswordChecks(password).map((check) => (
                <li key={check.label} className={check.ok ? "ok" : ""}>
                    <i className={check.ok ? "fas fa-circle-check" : "far fa-circle"}></i>{" "}
                    {check.label}
                </li>
            ))}
        </ul>
    );
}

export default PasswordRules;
