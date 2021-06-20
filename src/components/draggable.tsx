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
    (eventActions: MouseEvent | TouchEvent): void => {
      setInitial({ x: 0, y: 0, pressed: false });
      setPosition({ x: 0, y: 0 });
      onMouseUp?.(-1, -1);
    },
    [onMouseUp]
  );

  const onMouseMoveCallback = React.useCallback(
    (eventAction: MouseEvent | TouchEvent): void => {
      let ev;
      if (eventAction.type === "mousemove") {
        ev = eventAction as MouseEvent;
      } else {
        ev = (eventAction as TouchEvent).touches[0];
      }

      const x = boundingBox
        ? Math.max(Math.min(ev.pageX, boundingBox.right), boundingBox.left)
        : ev.pageX;
      const y = boundingBox
        ? Math.max(Math.min(ev.pageY, boundingBox.bottom), boundingBox.top)
        : ev.pageY;

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
      document.addEventListener("touchmove", onMouseMoveCallback);
      document.addEventListener("touchend", onMouseUpCallback);
    } else {
      document.removeEventListener("mousemove", activeCallback.current);
      document.removeEventListener("mouseup", onMouseUpCallback);
      document.removeEventListener("touchmove", activeCallback.current);
      document.removeEventListener("touchend", onMouseUpCallback);
    }
  }, [initial.pressed, onMouseMoveCallback, onMouseUpCallback]);

  const onMouseDownCallback = (
    eventAction: React.MouseEvent | React.TouchEvent
  ) => {
    let ev;
    if (eventAction.type === "mousedown") {
      ev = eventAction as React.MouseEvent;
    } else {
      ev = (eventAction as React.TouchEvent).touches[0];
    }
    const box = ref.current?.getBoundingClientRect();

    let initX = ev.pageX;
    let initY = ev.pageY;

    if (box) {
      initX = box?.x + box?.width / 2;
      initY = box?.y + box?.height / 2;
    }

    const x = boundingBox
      ? Math.max(Math.min(ev.pageX, boundingBox.right), boundingBox.left)
      : ev.pageX;
    const y = boundingBox
      ? Math.max(Math.min(ev.pageY, boundingBox.bottom), boundingBox.top)
      : ev.pageY;

    const dx = x - initX;
    const dy = y - initY;

    setPosition({ x: dx, y: dy });
    onMouseDown?.(x, y);
    setInitial({ x: initX, y: initY, pressed: true });
  };

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDownCallback}
      onTouchStart={onMouseDownCallback}
    >
      {children}
    </div>
  );
};
