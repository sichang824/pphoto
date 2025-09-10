// Lightweight IndexedDB KV helpers for blobs and JSON values
// Note: Runs in browser only

const DB_NAME = "pphoto";
const STORE_NAME = "kv";
const DB_VERSION = 1;

interface KvRecord<T = unknown> {
	key: string;
	value: T;
}

function openDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		if (typeof indexedDB === "undefined") {
			return reject(new Error("IndexedDB not available"));
		}
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				// key/value store, explicit key field
				db.createObjectStore(STORE_NAME, { keyPath: "key" });
			}
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

async function withStore<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => Promise<T>): Promise<T> {
	const db = await openDb();
	return new Promise<T>((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, mode);
		const store = tx.objectStore(STORE_NAME);
		fn(store).then(resolve).catch(reject);
		tx.oncomplete = () => db.close();
		tx.onerror = () => reject(tx.error);
	});
}

export async function put(key: string, value: unknown): Promise<void> {
	await withStore<void>("readwrite", async (store) => {
		return new Promise<void>((resolve, reject) => {
			const req = store.put({ key, value } as KvRecord);
			req.onsuccess = () => resolve();
			req.onerror = () => reject(req.error);
		});
	});
}

export async function get<T = unknown>(key: string): Promise<T | undefined> {
	return withStore<T | undefined>("readonly", async (store) => {
		return new Promise<T | undefined>((resolve, reject) => {
			const req = store.get(key);
			req.onsuccess = () => {
				const rec = req.result as KvRecord<T> | undefined;
				resolve(rec?.value);
			};
			req.onerror = () => reject(req.error);
		});
	});
}

export async function del(key: string): Promise<void> {
	await withStore<void>("readwrite", async (store) => {
		return new Promise<void>((resolve, reject) => {
			const req = store.delete(key);
			req.onsuccess = () => resolve();
			req.onerror = () => reject(req.error);
		});
	});
}

export async function keysWithPrefix(prefix: string): Promise<string[]> {
	return withStore<string[]>("readonly", async (store) => {
		return new Promise<string[]>((resolve, reject) => {
			const keys: string[] = [];
			const req = store.openCursor();
			req.onsuccess = () => {
				const cursor = req.result as IDBCursorWithValue | null;
				if (!cursor) return resolve(keys);
				const rec = cursor.value as KvRecord;
				if (typeof rec?.key === "string" && rec.key.startsWith(prefix)) {
					keys.push(rec.key);
				}
				cursor.continue();
			};
			req.onerror = () => reject(req.error);
		});
	});
}

export async function prefixClear(prefix: string): Promise<void> {
	const keys = await keysWithPrefix(prefix);
	for (const key of keys) {
		await del(key);
	}
}


