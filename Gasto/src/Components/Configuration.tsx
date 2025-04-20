import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

type ConfigurationProps = {
  open: boolean;
  onClose: () => void;
};

function Configuration({ open, onClose }:ConfigurationProps) {

  const[bajo,setBajo] = useState("");
  const[mid,setMid] = useState("");
  const[alto,setAlto] = useState("");

  const handleGuardar = () => {
    localStorage.setItem("bajo",bajo);
    localStorage.setItem("mid",mid);
    localStorage.setItem("alto",alto);

    window.location.reload();
  };

  useEffect(()=>{
    setBajo(String(localStorage.getItem("bajo")));
    setMid(String(localStorage.getItem("mid")));
    setAlto(String(localStorage.getItem("alto")));
  },[]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Configuración de gastos</DialogTitle>
      <DialogContent>
        <div className="SettingsContainer">
          <span>Límite de gastos bajos:</span>
          <TextField type='number' autoComplete='off' onChange={(e)=>setBajo(e.target.value)} fullWidth margin="dense" variant="outlined" value={bajo}/>
        </div>
      </DialogContent>
      <DialogContent>
        <div className="SettingsContainer">
          <span>Límite de gastos Medios:</span>
          <TextField type='number' autoComplete='off' onChange={(e)=>setMid(e.target.value)} fullWidth margin="dense" variant="outlined"  value={mid}/>
        </div>
      </DialogContent>
      <DialogContent>
        <div className="SettingsContainer">
          <span>Límite de gastos Altos:</span>
          <TextField type='number' autoComplete='off' onChange={(e)=>setAlto(e.target.value)} fullWidth margin="dense" variant="outlined" value={alto}/>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Configuration;
