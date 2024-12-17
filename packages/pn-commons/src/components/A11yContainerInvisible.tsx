import { ReactNode } from "react";

type Props = {
    field : ReactNode | string;
};
// Questo componente fa leggere allo screen reader il field passato dai proprio quando viene renderizzato
const A11yContainerInvisible: React.FC<Props> = ({ field }: Props) =>(
        <div
        aria-live="assertive"
        role="alert"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          clipPath: 'inset(50%)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >{field}      
      </div>
    );

export default A11yContainerInvisible;