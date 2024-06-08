import { auth, signOut } from "~/auth";

async function Home() {
  const session = await auth();
  console.log("session.accessToken", session?.user.accessToken);

  return (
    <div>
      <h1>Welcome to the home page</h1>
      <p>Hi {JSON.stringify(session?.user)}</p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}
export default Home;
