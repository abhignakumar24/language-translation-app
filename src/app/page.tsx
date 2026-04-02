import Image from "next/image";
import TextTranslator from '@/components/translation/TextTranslator';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Language Translation App
        </h1>
        <TextTranslator />
        </div>
      </main>
  );
}
