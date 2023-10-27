import { mount } from '@vue/test-utils'
import { VqTest } from '../VqTest'
import { describe, it, expect } from 'vitest'

// describe("HelloWorld.vue", () => {
//   it("should renders is page content is correct", () => {
//     const message = "Happy People";
//     const testMessage = "Happy People";
//     const wrapper = mount(HelloWorld, {
//       props: { message },
//     });

//     expect(wrapper.text()).toBe(testMessage);
//   });

//   it("should render if props value is correct", () => {
//     const message = "Happy People";
//     const testMessage = "Happy People";
//     const wrapper = mount(HelloWorld, {
//       props: { message },
//     });

//     expect(wrapper.vm.message).toBe(testMessage);
//   });
// });

describe('HelloWorld.vue', () => {
    it('should renders is page content is correct', () => {
        const title = 'Happy People'
        const defaultTitle = 'Default Title'
        const wrapper = mount(VqTest, {
            props: { title }
        })

        expect(wrapper.text()).toBe(title)
    })

    //   it("should render if props value is correct", () => {
    //     const title = "Happy People";
    //     const testMessage = "Happy People";
    //     const wrapper = mount(VqTest, {
    //       props: { title },
    //     });

    //     expect(wrapper.vm.title).toBe(testMessage);
    //   });
})
