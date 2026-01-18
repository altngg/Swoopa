export interface ItemCardProps {
  itemId: string | number;
  title?: string;
  exchangeItem?: string;
  onClick?: () => void;
}

export interface ListingCardProps {
  itemId: string | number;
  title?: string;
  exchangeItem?: string;
  userName?: string;
  isEditable?: boolean;
  onDelete?: (itemId: string | number) => void;
  onEdit?: (itemId: string | number) => void;
  onOpenChat?: () => void;
  
}