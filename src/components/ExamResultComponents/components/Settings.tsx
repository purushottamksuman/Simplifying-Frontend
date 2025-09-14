import React from 'react';
import { Database, Shield, Bell, Cog } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">System Settings</h2>
        
        <div className="space-y-6">
          <div className="border-b pb-6">
            <div className="flex items-center mb-4">
              <Database className="h-5 w-5 text-gray-500 mr-3" />
              <h3 className="text-md font-medium text-gray-900">Database Configuration</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              The system uses a normalized database schema with the following structure:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Core Tables:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• sections (id, name, total_questions)</li>
                    <li>• sub_sections (id, section_id, name, default_no_of_questions)</li>
                    <li>• questions (id, sub_section_id, question_text, marks)</li>
                    <li>• options (id, question_id, option_text, marks)</li>
                    <li>• default_options (id, sub_section_id, option_text, marks)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Relationships:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Sections → Sub-sections (1:N)</li>
                    <li>• Sub-sections → Questions (1:N)</li>
                    <li>• Questions → Options (1:N)</li>
                    <li>• Sub-sections → Default Options (1:N)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-gray-500 mr-3" />
              <h3 className="text-md font-medium text-gray-900">Security</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Row Level Security</p>
                  <p className="text-sm text-gray-600">Database access control enabled</p>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Enabled
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">API Authentication</p>
                  <p className="text-sm text-gray-600">Supabase authentication required</p>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <div className="flex items-center mb-4">
              <Bell className="h-5 w-5 text-gray-500 mr-3" />
              <h3 className="text-md font-medium text-gray-900">Notifications</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Email notifications for new questions</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">System maintenance alerts</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">Weekly analytics reports</span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <Cog className="h-5 w-5 text-gray-500 mr-3" />
              <h3 className="text-md font-medium text-gray-900">System Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Version</h4>
                <p className="text-sm text-gray-600">QMS v1.0.0</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Database</h4>
                <p className="text-sm text-gray-600">Supabase PostgreSQL</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Last Updated</h4>
                <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                <p className="text-sm text-green-600 font-medium">All systems operational</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};