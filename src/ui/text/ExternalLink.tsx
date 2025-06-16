import clsx from "clsx";
import type { ReactNode } from "react";
import { FiExternalLink } from "react-icons/fi";

export const ExternalLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer nofollow"
      className={clsx("link", className)}
    >
      {children}{" "}
      <sup>
        <FiExternalLink className="inline-block" />
      </sup>
    </a>
  );
};
