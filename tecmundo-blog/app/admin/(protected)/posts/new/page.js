import PostForm from '@/components/admin/PostForm';

export const metadata = { title: 'Novo Post — Admin TudoTecno' };

export default function NewPostPage() {
  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">Novo Post</h1>
        <p className="text-[var(--text-weak)] text-sm mt-1">Crie um novo artigo para o blog.</p>
      </div>
      <div className="bg-white rounded-xl border border-[var(--border)] p-6">
        <PostForm />
      </div>
    </div>
  );
}
