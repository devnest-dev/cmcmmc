import AttendanceScanner from "./AttendanceScanner";

type AttendancePageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function AttendancePage({ searchParams }: AttendancePageProps) {
  const { id } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <AttendanceScanner initialId={id} />
    </main>
  );
}
