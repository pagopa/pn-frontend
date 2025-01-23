import { render } from "../../../test-utils";
import { FormBoxSubtitle } from "../FormBoxSubtitle";

describe('FormBoxSubtitle Component', ()=>{
    it('render FormBoxSubtitle', ()=>{
        const { getByTestId } = render(
            <FormBoxSubtitle id="formBoxSubtitle-id" text="test"/>
          );
          const box = getByTestId('formBoxSubtitle-id');
          expect(box).toBeInTheDocument();
          expect(box).toHaveTextContent('test')
        })
})