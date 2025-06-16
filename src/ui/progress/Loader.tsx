import clsx from "clsx";
import styles from "./Loader.module.css";

export interface LoaderProps {
  className?: string;
}

export const Loader = ({ className }: LoaderProps) => {
  return (
    <span className={clsx(styles.loader, className ? className : "size-12")} />
  );
};

export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 z-30 bg-white flex justify-center items-center">
      <Loader className="size-32" />
    </div>
  );
};
