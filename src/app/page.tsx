"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function Home() {
  const router = useRouter();
  const signUp = api.auth.signUp.useMutation();

  // const sendVerificationEmail = api.auth.sendVerifyEmail.useMutation();

  // const verifyEmail = api.auth.verifyEmail.useMutation();

  // const test = api.test.test.useMutation();

  return (
    <main className=" flex h-screen w-full flex-col items-center justify-center gap-10">
      <h1>hello this is titile</h1>

      <button
        onClick={() => {
          signUp.mutate({
            branchId: "clx3kpnab00003qzu6jmilghk",
            email: "nnm22is002@nmamit.in",
            name: "Omkar Prabhu",
            password: "password",
            confirmPassword: "password",
            phone: "9448846524",
            year: "2023",
          });
        }}
      >
        Create
      </button>

      {/* <button
        onClick={() => {
          sendVerificationEmail.mutate({
            email: "nnm22is002@nmamit.in",
          });
        }}
      >
        send
      </button>

      <button
        onClick={() => {
          verifyEmail.mutate({
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHgza3IxMDkwMDAyOWY5anl6M2Q4Y3g5IiwianRpIjoiY2x4M2xoemVoMDAwMWNpeG42a210eGY4biIsImlhdCI6MTcxNzY5ODc3MiwiZXhwIjoxNzE3Nzg1MTcyfQ.q8pvOKzKV1KrKdpia7s1FjFbcczOOssDWIjawp88_Qg",
          });
        }}
      >
        verify
      </button> */}

      <button
        onClick={async () => {
          const res = signIn("credentials", {
            email: "nnm22is002@nmamit.in",
            password: "password",
            redirect: false,
          });
          res
            .then((res) => {
              res?.status === 200 && router.push("/home");
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        sign in
      </button>

      <button
        onClick={async () => {
          await signOut();
        }}
      >
        signout
      </button>

      {/* <button
        onClick={() => {
          test.mutate();
        }}
      >
        test protected ProcedureType
      </button> */}
    </main>
  );
}
