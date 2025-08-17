import { prisma } from "@/lib/prisma";

export default async function Home() {
  const user = await prisma.user.findFirst();
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Sonx</h1>
      <p className="text-lg">TUr Name here: {user?.name}</p>
    </div>
  );
}
