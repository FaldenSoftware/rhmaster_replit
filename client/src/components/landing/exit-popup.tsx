import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle, X } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';

export function ExitPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [popupShown, setPopupShown] = useLocalStorage<boolean>('exit-popup-shown', false);
  const [exitIntent, setExitIntent] = useState(false);
  
  // Monitorar a intenção de saída do usuário
  useEffect(() => {
    // Só mostrar o popup uma vez por sessão e depois de 5 segundos na página
    const timer = setTimeout(() => {
      if (!popupShown) {
        const handleMouseLeave = (e: MouseEvent) => {
          // Detectar quando o mouse sai pela parte superior da página
          if (e.clientY <= 5 && !exitIntent) {
            setExitIntent(true);
            setOpen(true);
          }
        };
        
        document.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
          document.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [popupShown, exitIntent]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui você normalmente enviaria o email para seu sistema
    // Por enquanto apenas simulamos uma submissão bem-sucedida
    if (email) {
      setSubmitted(true);
      setPopupShown(true);
      
      // Fechar o modal após 3 segundos
      setTimeout(() => {
        setOpen(false);
        
        // Reset após fechar
        setTimeout(() => {
          setSubmitted(false);
          setEmail('');
        }, 500);
      }, 3000);
    }
  };
  
  const handleClose = () => {
    setOpen(false);
    setPopupShown(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {!submitted ? (
            <>
              <DialogTitle className="text-xl text-center">
                Não perca essa oportunidade!
              </DialogTitle>
              <DialogDescription className="text-center">
                Receba um e-book exclusivo sobre "7 Estratégias Comprovadas para Acelerar o Desenvolvimento de Líderes"
              </DialogDescription>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <DialogTitle className="text-xl">Obrigado!</DialogTitle>
              <DialogDescription>
                Enviamos o e-book para seu email. Aproveite o conteúdo!
              </DialogDescription>
            </div>
          )}
        </DialogHeader>
        
        {!submitted && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Seu melhor email</Label>
                <Input
                  id="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="focus:ring-primary"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" className="w-full text-base">
                Receber E-book Grátis
              </Button>
            </DialogFooter>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Ao se inscrever, você concorda com nossa Política de Privacidade e Termos de Uso.
              Não enviaremos spam.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}