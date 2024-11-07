import { RichTextEditor } from "@/components/tip-tap";

export default async function Home() {
  return (
    <div className="flex items-center justify-center bg-slate-900 text-slate-50 h-screen w-full">
      <RichTextEditor />
    </div>
  );
}
