import { render } from "../../../test-utils";
import { FormBox } from "../FormBox";

describe('FormBox Component', ()=>{
    it('render FormBox', ()=>{
        const { getByTestId } = render(
            <FormBox testid="formBox-id" children={<div/>}/>
          );
          const box = getByTestId('formBox-id');
          expect(box).toBeInTheDocument()
        })
})