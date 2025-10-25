"use client";

import { useState, useEffect } from 'react';
import { getApolloClient } from '../../lib/apollo/client';
import { USER_BY_ID_QUERY, APPLICATION_BY_EMAIL_QUERY } from '../../lib/api/userVendor';
import Button from '../common/Button';
import Input from '../common/Input';
import Badge from '../common/Badge';
import { Edit2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';

interface VendorUserInfoProps {
  userId: string;
}

export default function VendorUserInfo({ userId }: VendorUserInfoProps) {
  const [user, setUser] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingApp, setIsEditingApp] = useState(false);
  const [userForm, setUserForm] = useState<any>({});
  const [appForm, setAppForm] = useState<any>({});
  
  // Accordion states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    business: false,
    vat: false,
    stores: false,
    address: false,
    products: false,
    online: false,
    additional: false,
  });

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const client = getApolloClient();
      
      const { data: userData } = await client.query<{ userById: any }>({
        query: USER_BY_ID_QUERY,
        variables: { id: userId },
        fetchPolicy: 'network-only',
      });

      if (userData?.userById) {
        setUser(userData.userById);
        setUserForm(userData.userById);

        try {
          const { data: appData } = await client.query<{ applicationByEmail: any }>({
            query: APPLICATION_BY_EMAIL_QUERY,
            variables: { email: userData.userById.email },
            fetchPolicy: 'network-only',
          });

          if (appData?.applicationByEmail) {
            setApplication(appData.applicationByEmail);
            setAppForm(appData.applicationByEmail);
          }
        } catch (_) {
          // Application not found is OK
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSaveUser = async () => {
    // TODO: Implement user update mutation
    console.log('Save user:', userForm);
    setIsEditingUser(false);
  };

  const handleSaveApp = async () => {
    // TODO: Implement application update mutation
    console.log('Save application:', appForm);
    setIsEditingApp(false);
  };

  const handleCancelUser = () => {
    setUserForm(user);
    setIsEditingUser(false);
  };

  const handleCancelApp = () => {
    setAppForm(application);
    setIsEditingApp(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-600">User information not available</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">User Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Full Name</p>
            <p className="font-medium text-gray-900">{user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="font-medium text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Phone</p>
            <p className="font-medium text-gray-900">{user.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Role</p>
            <Badge variant={user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'info' : 'neutral'}>
              {user.role}
            </Badge>
          </div>
        </div>
        <p className="text-gray-500 mt-4">Application details not available</p>
      </div>
    );
  }

  const AccordionSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    sectionKey: string; 
    children: React.ReactNode 
  }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {openSections[sectionKey] ? (
          <ChevronUp className="text-gray-400" size={20} />
        ) : (
          <ChevronDown className="text-gray-400" size={20} />
        )}
      </button>
      {openSections[sectionKey] && (
        <div className="px-6 pb-6">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{application.business_name}</h2>
          <p className="text-gray-600">{application.email}</p>
        </div>
        <Badge variant={application.status === 'APPROVED' ? 'success' : application.status === 'PENDING' ? 'warning' : 'danger'}>
          {application.status}
        </Badge>
      </div>

      {/* Personal Information */}
      <AccordionSection title="Personal Information" sectionKey="personal">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">First Name</p>
            <p className="font-medium text-gray-900">{application.first_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Last Name</p>
            <p className="font-medium text-gray-900">{application.last_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="font-medium text-gray-900">{application.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Phone</p>
            <p className="font-medium text-gray-900">{application.phone}</p>
          </div>
          {application.landline && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Landline (Optional)</p>
              <p className="font-medium text-gray-900">{application.landline}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600 mb-1">ID Number</p>
            <p className="font-medium text-gray-900">{application.sa_id_number || 'N/A'}</p>
          </div>
        </div>
      </AccordionSection>

      {/* Business Information */}
      <AccordionSection title="Business Information" sectionKey="business">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Seller Role</p>
            <p className="font-medium text-gray-900">{application.seller_role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Business Type</p>
            <p className="font-medium text-gray-900">{application.business_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Business Name</p>
            <p className="font-medium text-gray-900">{application.business_name}</p>
          </div>
          {application.business_registration && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Business Registration</p>
              <p className="font-medium text-gray-900">{application.business_registration}</p>
            </div>
          )}
        </div>
      </AccordionSection>

      {/* VAT & Financial Information */}
      <AccordionSection title="VAT & Financial Information" sectionKey="vat">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">VAT Registered</p>
            <Badge variant={application.vat_registered === 'Yes' ? 'success' : 'neutral'}>
              {application.vat_registered}
            </Badge>
          </div>
          {application.vat_number && (
            <div>
              <p className="text-sm text-gray-600 mb-1">VAT Number</p>
              <p className="font-medium text-gray-900">{application.vat_number}</p>
            </div>
          )}
          {application.monthly_revenue && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
              <p className="font-medium text-gray-900">{application.monthly_revenue}</p>
            </div>
          )}
        </div>
      </AccordionSection>

      {/* Physical Stores & Distribution */}
      <AccordionSection title="Physical Stores & Distribution" sectionKey="stores">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Physical Stores</p>
            <Badge variant={application.physical_stores === 'Yes' ? 'success' : 'neutral'}>
              {application.physical_stores}
            </Badge>
          </div>
          {application.number_of_stores && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Number of Stores</p>
              <p className="font-medium text-gray-900">{application.number_of_stores}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600 mb-1">Supplier to Retailers</p>
            <Badge variant={application.supplier_to_retailers === 'Yes' ? 'success' : 'neutral'}>
              {application.supplier_to_retailers}
            </Badge>
          </div>
          {application.other_marketplaces && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Other Marketplaces</p>
              <p className="font-medium text-gray-900">{application.other_marketplaces}</p>
            </div>
          )}
        </div>
      </AccordionSection>

      {/* Address Information */}
      <AccordionSection title="Address Information" sectionKey="address">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Address</p>
            <p className="font-medium text-gray-900">{application.address}</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">City</p>
              <p className="font-medium text-gray-900">{application.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Province</p>
              <p className="font-medium text-gray-900">{application.province}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Postal Code</p>
              <p className="font-medium text-gray-900">{application.postal_code}</p>
            </div>
          </div>
        </div>
      </AccordionSection>

      {/* Products & Inventory */}
      <AccordionSection title="Products & Inventory" sectionKey="products">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Primary Category</p>
            <p className="font-medium text-gray-900">{application.primary_category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Stock Type</p>
            <p className="font-medium text-gray-900">{application.stock_type}</p>
          </div>
          {application.unique_products && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Unique Products</p>
              <p className="font-medium text-gray-900">{application.unique_products}</p>
            </div>
          )}
          {application.owned_brands && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Owned Brands</p>
              <p className="font-medium text-gray-900">{application.owned_brands}</p>
            </div>
          )}
          {application.reseller_brands && (
            <div className="col-span-2">
              <p className="text-sm text-gray-600 mb-1">Reseller Brands</p>
              <p className="font-medium text-gray-900">{application.reseller_brands}</p>
            </div>
          )}
        </div>
        {application.product_description && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Product Description</p>
            <p className="text-gray-900">{application.product_description}</p>
          </div>
        )}
      </AccordionSection>

      {/* Online Presence */}
      <AccordionSection title="Online Presence" sectionKey="online">
        <div className="grid grid-cols-2 gap-6">
          {application.website && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Website</p>
              <p className="font-medium text-gray-900">{application.website}</p>
            </div>
          )}
          {application.social_media && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Social Media</p>
              <p className="font-medium text-gray-900">{application.social_media}</p>
            </div>
          )}
        </div>
        {(!application.website && !application.social_media) && (
          <p className="text-gray-500">No online presence information provided</p>
        )}
      </AccordionSection>

      {/* Additional Information */}
      <AccordionSection title="Additional Information" sectionKey="additional">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">How Did You Hear About Us?</p>
            <p className="font-medium text-gray-900">{application.how_did_you_hear}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Agrees to Terms & Conditions</p>
            <Badge variant={application.agree_to_terms ? 'success' : 'danger'}>
              {application.agree_to_terms ? 'Yes' : 'No'}
            </Badge>
          </div>
        </div>
        {application.business_summary && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Business Summary</p>
            <p className="text-gray-900">{application.business_summary}</p>
          </div>
        )}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Applied:</span> {new Date(application.created_at).toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </p>
        </div>
      </AccordionSection>
    </div>
  );
}
