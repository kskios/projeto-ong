function obterArmazenamento() {
    try {
        return { ok: true, armazenamento: window.localStorage };
    } catch {
        return { ok: false, armazenamento: null, error: "unavailable" };
    }
}

export function lerItem(chave) {
    const resultado = obterArmazenamento();
    if (!resultado.ok) {
        return { ok: false, value: null, error: resultado.error };
    }

    try {
        return {
            ok: true,
            value: resultado.armazenamento.getItem(chave),
            error: null
        };
    } catch {
        return { ok: false, value: null, error: "unavailable" };
    }
}

export function salvarItem(chave, valor) {
    const resultado = obterArmazenamento();
    if (!resultado.ok) {
        return { ok: false, error: resultado.error };
    }

    try {
        resultado.armazenamento.setItem(chave, valor);
        return { ok: true, error: null };
    } catch {
        return { ok: false, error: "unavailable" };
    }
}

export function removerItem(chave) {
    const resultado = obterArmazenamento();
    if (!resultado.ok) {
        return { ok: false, error: resultado.error };
    }

    try {
        resultado.armazenamento.removeItem(chave);
        return { ok: true, error: null };
    } catch {
        return { ok: false, error: "unavailable" };
    }
}

export function lerJSON(chave) {
    const resultado = lerItem(chave);
    if (!resultado.ok || resultado.value === null) {
        return resultado;
    }

    try {
        return { ok: true, value: JSON.parse(resultado.value), error: null };
    } catch {
        return { ok: false, value: null, error: "invalid-json" };
    }
}

export function salvarJSON(chave, valor) {
    try {
        return salvarItem(chave, JSON.stringify(valor));
    } catch {
        return { ok: false, error: "serialization" };
    }
}
