import { render } from "../../../test-utils";
import { FormBoxTitle } from "../FormBoxTitle";

describe('FormBoxTitle Component', ()=>{
    it('render FormBoxTitle', ()=>{
        const { getByTestId } = render(
            <FormBoxTitle id="formBoxTitle-id" text="test"/>
          );
          const box = getByTestId('formBoxTitle-id');
          expect(box).toBeInTheDocument();
          expect(box).toHaveTextContent('test')
        })
})