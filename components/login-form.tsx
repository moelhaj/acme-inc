"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { AppLogo } from "./nav/app-logo"
import { Login, State } from "@/actions/auth"
import { useActionState } from "react"

export function LoginForm() {
    const initialState: State = { message: null, errors: {} }
    const [state, formAction, pending] = useActionState(Login, initialState)
    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AppLogo />
                    </div>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value="maeve.millay@acme-inc.com"
                                    readOnly
                                />
                                {state.errors?.email &&
                                    state.errors.email.map((error: string) => (
                                        <FieldError>{error}</FieldError>
                                    ))}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">
                                    Password
                                </FieldLabel>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value="Password123!"
                                    readOnly
                                />
                                {state.errors?.password &&
                                    state.errors.password.map(
                                        (error: string) => (
                                            <FieldError>{error}</FieldError>
                                        )
                                    )}
                            </Field>
                            <Field>
                                <Button
                                    size="lg"
                                    type="submit"
                                    disabled={pending}
                                >
                                    {pending && (
                                        <Spinner data-icon="inline-start" />
                                    )}
                                    {!pending && "Sign In"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
