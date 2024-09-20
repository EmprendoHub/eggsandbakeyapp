import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

const MovieModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "85%",
              maxWidth: "850px",
              height: "auto",
              maxHeight: "80vh",
              backgroundColor: "black",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <ReactPlayer
              url={videoUrl}
              width="100%"
              height="100%"
              controls={false}
              playing={true}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MovieModal;
