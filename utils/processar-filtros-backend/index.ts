const processarFiltros = (
  filtros: any,
  operadoresEspecificos: any = {},
  camposEspecificos: any = {}
) => {
  const filtrosProcessados: any = [];
  for (const chave in filtros) {
    const valor = filtros[chave];
    if (Array.isArray(valor) && valor.length === 0) continue;
    if (
      valor === null ||
      valor === "" ||
      (typeof valor !== "string" &&
        typeof valor !== "number" &&
        !Array.isArray(valor) &&
        typeof valor !== "boolean")
    )
      continue;

    const operator = operadoresEspecificos[chave] || "equal";
    const valorProcessado = operator === "like" ? `%${valor}%` : valor;

    const campo = camposEspecificos[chave] || chave;

    if (valorProcessado === undefined || valorProcessado === null) continue;

    filtrosProcessados.push({
      field: campo,
      value: valorProcessado,
      operator: operator,
    });
  }
  return filtrosProcessados;
};

export default processarFiltros;
