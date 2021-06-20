import React, { useRef, useState, useEffect } from "react";

type Props = {
  children: React.ReactNode;
  boundingBox?: DOMRect;
  onMouseDown?: (x: number, y: number) => void;
  onMouseMove?: (x: number, y: number) => void;
  onMouseUp?: (x: number, y: number) => void;
};

export const Draggable = ({
  children,
  boundingBox,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: Props) => {
  const [initial, setInitial] = useState({ x: 0, y: 0, pressed: false });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && initial.pressed) {
      ref.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    } else if (ref.current) {
      ref.current.style.transform = "";
    }
  }, [position, initial.pressed]);

  const onMouseUpCallback = React.useCallback(
    (event: MouseEvent): void => {
      setInitial({ x: 0, y: 0, pressed: false });
      setPosition({ x: 0, y: 0 });
      onMouseUp?.(-1, -1);
    },
    [onMouseUp]
  );

  const onMouseMoveCallback = React.useCallback(
    (event: MouseEvent): void => {
      const x = boundingBox
        ? Math.max(Math.min(event.pageX, boundingBox.right), boundingBox.left)
        : event.pageX;
      const y = boundingBox
        ? Math.max(Math.min(event.pageY, boundingBox.bottom), boundingBox.top)
        : event.pageY;

      const dx = x - initial.x;
      const dy = y - initial.y;

      onMouseMove?.(x, y);
      setPosition({
        x: dx,
        y: dy,
      });
    },
    [initial, boundingBox, onMouseMove]
  );
  const activeCallback = useRef(onMouseMoveCallback);

  useEffect(() => {
    if (initial.pressed) {
      activeCallback.current = onMouseMoveCallback;
      document.addEventListener("mousemove", onMouseMoveCallback);
      document.addEventListener("mouseup", onMouseUpCallback);
    } else {
      document.removeEventListener("mousemove", activeCallback.current);
      document.removeEventListener("mouseup", onMouseUpCallback);
    }
  }, [initial.pressed, onMouseMoveCallback, onMouseUpCallback]);

  const onMouseDownCallback = (e: React.MouseEvent) => {
    const box = ref.current?.getBoundingClientRect();

    let initX = e.pageX;
    let initY = e.pageY;

    if (box) {
      initX = box?.x + box?.width / 2;
      initY = box?.y + box?.height / 2;
    }

    const x = boundingBox
      ? Math.max(Math.min(e.pageX, boundingBox.right), boundingBox.left)
      : e.pageX;
    const y = boundingBox
      ? Math.max(Math.min(e.pageY, boundingBox.bottom), boundingBox.top)
      : e.pageY;

    const dx = x - initX;
    const dy = y - initY;

    setPosition({ x: dx, y: dy });
    onMouseDown?.(x, y);
    setInitial({ x: initX, y: initY, pressed: true });
  };

  return (
    <div ref={ref} onMouseDown={onMouseDownCallback}>
      {children}
    </div>
  );
};
