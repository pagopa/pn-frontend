import React, { ReactNode } from "react";

type Props = {
    field : ReactNode | string;
    ariaLive: 'assertive' | 'polite' | 'off';
    role : React.AriaRole;
};
// Questo componente fa leggere allo screen reader il field passato dai proprio quando viene renderizzato
// role alert ha di default aria live assertive
const A11yContainerInvisible: React.FC<Props> = ({ field, ariaLive, role }: Props) =>(
        <div
        aria-live={ariaLive}
        role={role}
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
      >{field}</div>
    );

export default A11yContainerInvisible;