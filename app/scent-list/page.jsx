import { cookies } from "next/headers";
import ScentForm from "../components/ScentForm";
import EditScent from "../components/EditScent";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { deleteScent } from "../server-actions/deleteScent";
export default async function ScentList() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  const { data: scents, error } = await supabase
    .from("scents")
    .select("*")
    .eq("user_id", user.id)
    .order("brand", { ascending: true });

  if (error) {
    console.error("Error fetching scents");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <div className="container mx-auto p-6 sm:p-12">
        <div className="flex justify-between items-start">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            My Scent List
          </h1>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Out
            </button>
          </form>
        </div>
        <ScentForm />
        <div className="mt-6">
          {scents.map((scent) => (
            <div
              key={scent.id}
              className="mb-4 p-4 bg-gray-800 rounded-lg shadow"
            >
              <h2 className="text-xl text-white mb-2">
                {scent.brand} - {scent.model}
              </h2>
              <div className="flex space-x-2">
                <form action={deleteScent}>
                  <input type="hidden" name="id" value={scent.id} />
                  <button
                    type="submit"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </form>
                <EditScent scent={scent} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
