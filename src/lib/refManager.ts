type SimpleRef = { name: string; destroy(): void };

type RefferenceNode<T extends SimpleRef> = {
  value: T;
  referenceCout: number;
};

export const RefManager = <T extends SimpleRef>(
  storage: Record<string, RefferenceNode<T>>
) => {
  return {
    register(value: T) {
      if (!storage[value.name]) {
        storage[value.name] = {
          value,
          referenceCout: 1,
        };
      }
    },
    get(name: string) {
      const node = storage[name];
      if (!node) {
        throw new Error(`Cannot get material by name ${name}`);
      }

      node.referenceCout++;
      return node.value;
    },

    release(name: string) {
      const node = storage[name];
      if (!node) {
        console.warn(
          `Cannot release a material which has not been registered. ${name}`
        );
      } else {
        node.referenceCout--;
        if (node.referenceCout < 1) {
          node.value.destroy();
          // @ts-ignore
          storage[name] = undefined;
          delete storage[name];
        }
      }
    },
  };
};
