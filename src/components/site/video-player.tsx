import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { safeUrl } from "@/lib/security";

const EVENTO_TOCANDO = "paitiago:video-tocando";

let contador = 0;

/**
 * Player de arquivo de vídeo: carrega antes de tocar (evita travar no começo),
 * mostra a capa enquanto baixa e pausa sozinho quando outro vídeo começa.
 */
export function VideoPlayer({
  src,
  poster,
  titulo,
  className,
}: {
  src: string;
  poster?: string;
  titulo: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const idRef = useRef<string>("");
  const [carregando, setCarregando] = useState(true);

  if (!idRef.current) {
    contador += 1;
    idRef.current = `video-${contador}`;
  }

  useEffect(() => {
    const aoTocarOutro = (evento: Event) => {
      const origem = (evento as CustomEvent<string>).detail;
      if (origem !== idRef.current) {
        videoRef.current?.pause();
      }
    };

    window.addEventListener(EVENTO_TOCANDO, aoTocarOutro);
    return () => window.removeEventListener(EVENTO_TOCANDO, aoTocarOutro);
  }, []);

  return (
    <div className={cn("relative h-full w-full bg-black", className)}>
      <video
        ref={videoRef}
        src={safeUrl(src)}
        poster={poster ? safeUrl(poster) : undefined}
        controls
        autoPlay
        playsInline
        preload="auto"
        title={titulo}
        onPlay={() =>
          window.dispatchEvent(
            new CustomEvent(EVENTO_TOCANDO, { detail: idRef.current }),
          )
        }
        onCanPlay={() => setCarregando(false)}
        onPlaying={() => setCarregando(false)}
        onWaiting={() => setCarregando(true)}
        className="h-full w-full bg-black"
      />

      {carregando && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/55">
          <Loader2 className="h-6 w-6 animate-spin text-secondary" />
        </div>
      )}
    </div>
  );
}
