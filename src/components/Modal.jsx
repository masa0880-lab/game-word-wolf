// 汎用モーダル。遊び方説明・確認ダイアログに使用。
export default function Modal({ open, onClose, title, children, closeLabel = "閉じる" }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-body">{children}</div>
        <button className="btn btn-secondary" onClick={onClose}>
          {closeLabel}
        </button>
      </div>
    </div>
  );
}

// はい/いいえの確認ダイアログ
export function ConfirmDialog({ open, message, onConfirm, onCancel, confirmLabel = "はい", cancelLabel = "キャンセル" }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
