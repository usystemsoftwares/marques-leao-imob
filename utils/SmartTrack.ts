class SmartTrack {
  empresaId: string;
  dispositivo: string;
  paginas_visitadas: string[];
  imoveis_visitados: string[];
  imoveis_tempo_visitado: number[];
  imoveis_tempo_visitado_check: boolean[];
  hidden_delay: number;
  fotos_tempo_info: Record<string, Record<string, number>>;
  inicio_visita: Date;
  id: string;
  referrer: string | null;
  filtros: string[];

  constructor(empresaId: string) {
    this.empresaId = empresaId;
    this.dispositivo = this.getDispositivo();
    this.paginas_visitadas = [];
    this.imoveis_visitados = [];
    this.imoveis_tempo_visitado = [];
    this.imoveis_tempo_visitado_check = [];
    this.hidden_delay = 0;
    this.fotos_tempo_info = {};
    this.inicio_visita = new Date();
    this.id = this.getUUID();
    this.referrer = document.referrer;
    this.filtros = [];

    console.log(`SmartTrack initialized with empresaId: ${empresaId}`);

    this.initialize();
  }

  getUUID() {
    let id = localStorage.getItem("visitante_id");
    if (!id) {
      id = this.generateUUID();
      localStorage.setItem("visitante_id", id);
    }
    console.log(`UUID: ${id}`);
    return id;
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getDispositivo() {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk|android(?!.*mobi)/i.test(userAgent)) {
      console.log("Device: tablet");
      return "tablet";
    }
    if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
      console.log("Device: mobile");
      return "mobile";
    }
    console.log("Device: desktop");
    return "desktop";
  }

  setFotoTempo({ id, imovel, tempo }: any) {
    console.log(`Set foto tempo: id=${id}, imovel=${imovel}, tempo=${tempo}`);
    if (!this.fotos_tempo_info[imovel]) {
      this.fotos_tempo_info[imovel] = {};
    }
    this.fotos_tempo_info[imovel][id] = tempo;
  }

  addFotoTempo({ id, imovel, tempo }: any) {
    console.log(`Add foto tempo: id=${id}, imovel=${imovel}, tempo=${tempo}`);
    if (!this.fotos_tempo_info[imovel]) {
      this.fotos_tempo_info[imovel] = {};
    }
    if (!this.fotos_tempo_info[imovel][id]) {
      this.fotos_tempo_info[imovel][id] = 0;
    }
    this.fotos_tempo_info[imovel][id] += tempo;
  }

  buildVisitReport() {
    const now = new Date();
    const report = {
      dispositivo: this.dispositivo,
      paginas_visitadas: this.paginas_visitadas.length === 0 ? ["/"] : this.paginas_visitadas,
      imoveis_visitados: this.imoveis_visitados,
      time_inicio_visita: this.inicio_visita.getTime(),
      time_fim_visita: now.getTime(),
      empresa_id: this.empresaId,
      filtros: this.filtros,
      id: this.id,
      referrer: this.referrer,
    };

    this.paginas_visitadas = [];
    this.imoveis_visitados = [];
    this.inicio_visita = new Date();

    console.log("Visit report built:", report);
    return JSON.stringify(report);
  }

  initialize() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args: [any, string, string?]) => {
      console.log("pushState called with args:", args);
      const ret = originalPushState.apply(history, args);
      window.dispatchEvent(new Event('pushstate'));
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    };

    history.replaceState = (...args: [any, string, string?]) => {
      console.log("replaceState called with args:", args);
      const ret = originalReplaceState.apply(history, args);
      window.dispatchEvent(new Event('replacestate'));
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    };

    window.addEventListener('popstate', () => {
      console.log("popstate event detected");
      window.dispatchEvent(new Event('locationchange'));
    });

    // Debounce locationchange event handling to prevent rapid consecutive executions
    let handleLocationChangeTimeout: NodeJS.Timeout | null = null;
    const handleLocationChangeDebounced = () => {
      if (handleLocationChangeTimeout) {
        clearTimeout(handleLocationChangeTimeout);
      }
      handleLocationChangeTimeout = setTimeout(() => {
        console.log("locationchange event detected");
        this.handleLocationChange();
      }, 100); // Adjust the debounce delay as needed
    };

    window.addEventListener('locationchange', handleLocationChangeDebounced);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.hidden_delay = new Date().getTime();
        const report = this.buildVisitReport();
        console.log("Document hidden, sending beacon with report:", report);
        const api = process.env.NEXT_PUBLIC_BACKEND_API_URI
        navigator.sendBeacon(`${api}/visitantes/site`, report);
      } else {
        this.hidden_delay = new Date().getTime() - this.hidden_delay;
        console.log("Document visible, hidden delay:", this.hidden_delay);
      }
    });

    this.handleLocationChange();
    console.log("SmartTrack initialized!");
  }

  handleLocationChange() {
    console.log("Handling location change to:", location.pathname);
    this.paginas_visitadas.push(location.pathname);

    if (this.imoveis_tempo_visitado.length > 0) {
      const lastIndex = this.imoveis_tempo_visitado.length - 1;
      if (!this.imoveis_tempo_visitado_check[lastIndex]) {
        this.imoveis_tempo_visitado[lastIndex] = new Date().getTime() - this.imoveis_tempo_visitado[lastIndex] - this.hidden_delay;
        this.imoveis_tempo_visitado_check[lastIndex] = true;
      }
    }

    if (location.pathname.includes("/imovel/")) {
      const parts = location.pathname.split("/");
      const imovelId = parts[parts.length - 1];
      console.log("Visited imovel:", imovelId);
      this.imoveis_visitados.push(imovelId);
      this.imoveis_tempo_visitado.push(new Date().getTime());
      this.imoveis_tempo_visitado_check.push(false);
    } else if (location.pathname.includes("/perfilImovel") || location.pathname.includes("/cardImovel")) {
      const imovelId = new URL(location.href).searchParams.get("id_imovel") || "";
      console.log("Visited perfilImovel or cardImovel with id:", imovelId);
      this.imoveis_visitados.push(imovelId);
      this.imoveis_tempo_visitado.push(new Date().getTime());
      this.imoveis_tempo_visitado_check.push(false);
    }
  }

  registrarFiltro(filtro: string) {
    console.log("Filtro registrado:", filtro);
    this.filtros.push(filtro);
  }
}

export default SmartTrack;
