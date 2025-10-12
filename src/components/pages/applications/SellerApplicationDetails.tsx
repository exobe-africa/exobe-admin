"use client";

import Badge from '../../common/Badge';
import Input from '../../common/Input';
import Select from '../../common/Select';
import Accordion from '../../common/Accordion';

interface SellerApplicationDetailsProps {
  selectedApplication: any;
  editedApplication: any;
  isEditing: boolean;
  onFieldChange: (field: string, value: any) => void;
}

export default function SellerApplicationDetails({
  selectedApplication,
  editedApplication,
  isEditing,
  onFieldChange,
}: SellerApplicationDetailsProps) {
  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      {/* Header with Status */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {editedApplication.first_name} {editedApplication.last_name}
          </h3>
          <p className="text-sm text-gray-600">{editedApplication.email}</p>
        </div>
        <Badge variant={
          selectedApplication.status === 'APPROVED' ? 'success' :
          selectedApplication.status === 'REJECTED' ? 'danger' :
          'warning'
        }>
          {selectedApplication.status}
        </Badge>
      </div>

      {/* Personal Information */}
      <Accordion title="Personal Information" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={editedApplication.first_name || ''}
            onChange={(v) => onFieldChange('first_name', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Last Name"
            value={editedApplication.last_name || ''}
            onChange={(v) => onFieldChange('last_name', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Email"
            value={editedApplication.email || ''}
            onChange={(v) => onFieldChange('email', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Phone"
            value={editedApplication.phone || ''}
            onChange={(v) => onFieldChange('phone', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Landline (Optional)"
            value={editedApplication.landline || ''}
            onChange={(v) => onFieldChange('landline', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="ID Number"
            value={editedApplication.sa_id_number || ''}
            onChange={(v) => onFieldChange('sa_id_number', v)}
            disabled={!isEditing}
            fullWidth
          />
        </div>
      </Accordion>

      {/* Business Information */}
      <Accordion title="Business Information" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Seller Role"
            value={editedApplication.seller_role || ''}
            onChange={(v) => onFieldChange('seller_role', v)}
            options={[
              { value: 'RETAILER', label: 'Retailer' },
              { value: 'WHOLESALER', label: 'Wholesaler' },
            ]}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Business Type"
            value={editedApplication.business_type || ''}
            onChange={(v) => onFieldChange('business_type', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Business Name"
            value={editedApplication.business_name || ''}
            onChange={(v) => onFieldChange('business_name', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Business Registration"
            value={editedApplication.business_registration || ''}
            onChange={(v) => onFieldChange('business_registration', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Applicant Type"
            value={editedApplication.applicant_type || ''}
            onChange={(v) => onFieldChange('applicant_type', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Identification Type"
            value={editedApplication.identification_type || ''}
            onChange={(v) => onFieldChange('identification_type', v)}
            disabled={!isEditing}
            fullWidth
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Summary
          </label>
          <textarea
            value={editedApplication.business_summary || ''}
            onChange={(e) => onFieldChange('business_summary', e.target.value)}
            disabled={!isEditing}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </Accordion>

      {/* VAT & Financial Information */}
      <Accordion title="VAT & Financial Information">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="VAT Registered"
            value={editedApplication.vat_registered || ''}
            onChange={(v) => onFieldChange('vat_registered', v)}
            options={[
              { value: 'YES', label: 'Yes' },
              { value: 'NO', label: 'No' },
            ]}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="VAT Number"
            value={editedApplication.vat_number || ''}
            onChange={(v) => onFieldChange('vat_number', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Monthly Revenue"
            value={editedApplication.monthly_revenue || ''}
            onChange={(v) => onFieldChange('monthly_revenue', v)}
            disabled={!isEditing}
            fullWidth
          />
        </div>
      </Accordion>

      {/* Physical Stores */}
      <Accordion title="Physical Stores & Distribution">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Physical Stores"
            value={editedApplication.physical_stores || ''}
            onChange={(v) => onFieldChange('physical_stores', v)}
            options={[
              { value: 'YES', label: 'Yes' },
              { value: 'NO', label: 'No' },
            ]}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Number of Stores"
            value={editedApplication.number_of_stores || ''}
            onChange={(v) => onFieldChange('number_of_stores', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Select
            label="Supplier to Retailers"
            value={editedApplication.supplier_to_retailers || ''}
            onChange={(v) => onFieldChange('supplier_to_retailers', v)}
            options={[
              { value: 'YES', label: 'Yes' },
              { value: 'NO', label: 'No' },
            ]}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Other Marketplaces"
            value={editedApplication.other_marketplaces || ''}
            onChange={(v) => onFieldChange('other_marketplaces', v)}
            disabled={!isEditing}
            fullWidth
          />
        </div>
      </Accordion>

      {/* Address Information */}
      <Accordion title="Address Information">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input
              label="Address"
              value={editedApplication.address || ''}
              onChange={(v) => onFieldChange('address', v)}
              disabled={!isEditing}
              fullWidth
            />
          </div>
          <Input
            label="City"
            value={editedApplication.city || ''}
            onChange={(v) => onFieldChange('city', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Province"
            value={editedApplication.province || ''}
            onChange={(v) => onFieldChange('province', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Postal Code"
            value={editedApplication.postal_code || ''}
            onChange={(v) => onFieldChange('postal_code', v)}
            disabled={!isEditing}
            fullWidth
          />
        </div>
      </Accordion>

      {/* Products & Inventory */}
      <Accordion title="Products & Inventory">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Primary Category"
            value={editedApplication.primary_category || ''}
            onChange={(v) => onFieldChange('primary_category', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Stock Type"
            value={editedApplication.stock_type || ''}
            onChange={(v) => onFieldChange('stock_type', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Unique Products"
            value={editedApplication.unique_products || ''}
            onChange={(v) => onFieldChange('unique_products', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Owned Brands"
            value={editedApplication.owned_brands || ''}
            onChange={(v) => onFieldChange('owned_brands', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Reseller Brands"
            value={editedApplication.reseller_brands || ''}
            onChange={(v) => onFieldChange('reseller_brands', v)}
            disabled={!isEditing}
            fullWidth
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Description
          </label>
          <textarea
            value={editedApplication.product_description || ''}
            onChange={(e) => onFieldChange('product_description', e.target.value)}
            disabled={!isEditing}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </Accordion>

      {/* Online Presence */}
      <Accordion title="Online Presence">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Website"
            value={editedApplication.website || ''}
            onChange={(v) => onFieldChange('website', v)}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="Social Media"
            value={editedApplication.social_media || ''}
            onChange={(v) => onFieldChange('social_media', v)}
            disabled={!isEditing}
            fullWidth
          />
        </div>
      </Accordion>

      {/* Additional Information */}
      <Accordion title="Additional Information">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="How Did You Hear About Us?"
            value={editedApplication.how_did_you_hear || ''}
            onChange={(v) => onFieldChange('how_did_you_hear', v)}
            disabled={!isEditing}
            fullWidth
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={editedApplication.agree_to_terms || false}
              onChange={(e) => onFieldChange('agree_to_terms', e.target.checked)}
              disabled={!isEditing}
              className="w-4 h-4 text-[#C8102E] border-gray-300 rounded focus:ring-[#C8102E]"
            />
            <label className="ml-2 text-sm text-gray-700">Agrees to Terms & Conditions</label>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            <strong>Applied:</strong> {new Date(selectedApplication.created_at).toLocaleDateString()} at {new Date(selectedApplication.created_at).toLocaleTimeString()}
          </p>
        </div>
      </Accordion>
    </div>
  );
}

