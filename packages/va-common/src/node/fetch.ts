export async function fetchJson<T extends object>(link: string): Promise<T | null> {
   const response = await fetch(link).catch(_ => null);
   if (!response?.ok) return null;

   return response.json().catch(() => null) as T | null;
}
