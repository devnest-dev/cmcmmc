"use client";

import { useState, type ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PAYMENT_MODES, type Submission } from "@/lib/admin-submissions";
import {
  affiliationOptions,
  day1Options,
  day2Options,
  designationOptions,
  ministryOptions,
  parishOptions,
  shirtSizes,
  titleOptions,
} from "@/lib/registration-options";

const selectClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

// Shared by the edit and add-entry forms. Field names match what
// parseSubmissionDetailsForm in lib/admin/submissions/actions.ts reads.
export default function SubmissionDetailsFields({
  defaults,
  disabled,
}: {
  defaults: Partial<Submission>;
  disabled: boolean;
}) {
  const [affiliationType, setAffiliationType] = useState<Submission["affiliationType"]>(
    defaults.affiliationType ?? "parish",
  );
  const [archdiocese, setArchdiocese] = useState(defaults.archdiocese ?? parishOptions[0]);
  const [roleInMinistry, setRoleInMinistry] = useState(defaults.roleInMinistry ?? ministryOptions[0]);
  const [designation, setDesignation] = useState(defaults.designation ?? designationOptions[0]);

  return (
    <>
      <div className="space-y-3">
        <p className="text-sm font-semibold text-[#1a2e5a]">Personal information</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" htmlFor="title">
            <select
              id="title"
              name="title"
              defaultValue={defaults.title}
              className={selectClassName}
              disabled={disabled}
            >
              {titleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <Field label="First name" htmlFor="firstName">
            <Input id="firstName" name="firstName" defaultValue={defaults.firstName} disabled={disabled} required />
          </Field>
          <Field label="Middle name" htmlFor="middleName">
            <Input id="middleName" name="middleName" defaultValue={defaults.middleName} disabled={disabled} />
          </Field>
          <Field label="Surname" htmlFor="surname">
            <Input id="surname" name="surname" defaultValue={defaults.surname} disabled={disabled} required />
          </Field>
          <Field label="Congregation" htmlFor="congregation">
            <Input id="congregation" name="congregation" defaultValue={defaults.congregation} disabled={disabled} />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" defaultValue={defaults.email} disabled={disabled} required />
          </Field>
          <Field label="Mobile" htmlFor="mobile">
            <Input id="mobile" name="mobile" defaultValue={defaults.mobile} disabled={disabled} required />
          </Field>
          <Field label="Complete address" htmlFor="completeAddress">
            <Input
              id="completeAddress"
              name="completeAddress"
              defaultValue={defaults.completeAddress}
              disabled={disabled}
            />
          </Field>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-[#1a2e5a]">Shirt & logistics</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Shirt size" htmlFor="shirtSize">
            <select
              id="shirtSize"
              name="shirtSize"
              defaultValue={defaults.shirtSize}
              className={selectClassName}
              disabled={disabled}
            >
              {shirtSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Day 1 session" htmlFor="day1Session">
            <select
              id="day1Session"
              name="day1Session"
              defaultValue={defaults.day1Session}
              className={selectClassName}
              disabled={disabled}
            >
              {day1Options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Day 2 session" htmlFor="day2Session">
            <select
              id="day2Session"
              name="day2Session"
              defaultValue={defaults.day2Session}
              className={selectClassName}
              disabled={disabled}
            >
              {day2Options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Accommodation" htmlFor="accommodation">
            <select
              id="accommodation"
              name="accommodation"
              defaultValue={defaults.accommodation}
              className={selectClassName}
              disabled={disabled}
            >
              <option value="avail">Requested</option>
              <option value="self">Not requested</option>
            </select>
          </Field>
          <Field label="Payment mode" htmlFor="paymentMode">
            <select
              id="paymentMode"
              name="paymentMode"
              defaultValue={defaults.paymentMode}
              className={selectClassName}
              disabled={disabled}
            >
              {PAYMENT_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Transaction number" htmlFor="transactionNumber">
            <Input
              id="transactionNumber"
              name="transactionNumber"
              defaultValue={defaults.transactionNumber}
              disabled={disabled}
            />
          </Field>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-[#1a2e5a]">Affiliation</p>
        <Field label="Affiliation type" htmlFor="affiliationType">
          <select
            id="affiliationType"
            name="affiliationType"
            value={affiliationType}
            onChange={(e) => setAffiliationType(e.target.value as Submission["affiliationType"])}
            className={selectClassName}
            disabled={disabled}
          >
            {affiliationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        {affiliationType === "parish" && (
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
            <Field label="Archdiocese" htmlFor="archdiocese">
              <select
                id="archdiocese"
                name="archdiocese"
                value={archdiocese}
                onChange={(e) => setArchdiocese(e.target.value)}
                className={selectClassName}
                disabled={disabled}
              >
                {parishOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
            {archdiocese === "Others" && (
              <Field label="Archdiocese (other)" htmlFor="archdioceseOther">
                <Input
                  id="archdioceseOther"
                  name="archdioceseOther"
                  defaultValue={defaults.archdioceseOther}
                  disabled={disabled}
                />
              </Field>
            )}
            <Field label="Parish name" htmlFor="parishName">
              <Input id="parishName" name="parishName" defaultValue={defaults.parishName} disabled={disabled} />
            </Field>
            <Field label="Parish address" htmlFor="parishAddress">
              <Input
                id="parishAddress"
                name="parishAddress"
                defaultValue={defaults.parishAddress}
                disabled={disabled}
              />
            </Field>
            <Field label="Organization name" htmlFor="organizationName">
              <Input
                id="organizationName"
                name="organizationName"
                defaultValue={defaults.organizationName}
                disabled={disabled}
              />
            </Field>
            <Field label="Role in ministry" htmlFor="roleInMinistry">
              <select
                id="roleInMinistry"
                name="roleInMinistry"
                value={roleInMinistry}
                onChange={(e) => setRoleInMinistry(e.target.value)}
                className={selectClassName}
                disabled={disabled}
              >
                {ministryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
            {roleInMinistry === "Others" && (
              <Field label="Role in ministry (other)" htmlFor="roleInMinistryOther">
                <Input
                  id="roleInMinistryOther"
                  name="roleInMinistryOther"
                  defaultValue={defaults.roleInMinistryOther}
                  disabled={disabled}
                />
              </Field>
            )}
          </div>
        )}

        {affiliationType === "school" && (
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
            <Field label="Province" htmlFor="province">
              <Input id="province" name="province" defaultValue={defaults.province} disabled={disabled} />
            </Field>
            <Field label="School name" htmlFor="schoolName">
              <Input id="schoolName" name="schoolName" defaultValue={defaults.schoolName} disabled={disabled} />
            </Field>
            <Field label="School address" htmlFor="schoolAddress">
              <Input
                id="schoolAddress"
                name="schoolAddress"
                defaultValue={defaults.schoolAddress}
                disabled={disabled}
              />
            </Field>
            <Field label="Designation" htmlFor="designation">
              <select
                id="designation"
                name="designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className={selectClassName}
                disabled={disabled}
              >
                {designationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
            {designation === "Others" && (
              <Field label="Designation (other)" htmlFor="designationOther">
                <Input
                  id="designationOther"
                  name="designationOther"
                  defaultValue={defaults.designationOther}
                  disabled={disabled}
                />
              </Field>
            )}
          </div>
        )}

        {affiliationType === "neither" && (
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
            <Field label="Company / organization" htmlFor="companyOrganization">
              <Input
                id="companyOrganization"
                name="companyOrganization"
                defaultValue={defaults.companyOrganization}
                disabled={disabled}
              />
            </Field>
            <Field label="Company address" htmlFor="companyAddress">
              <Input
                id="companyAddress"
                name="companyAddress"
                defaultValue={defaults.companyAddress}
                disabled={disabled}
              />
            </Field>
            <Field label="Position / designation" htmlFor="positionDesignation">
              <Input
                id="positionDesignation"
                name="positionDesignation"
                defaultValue={defaults.positionDesignation}
                disabled={disabled}
              />
            </Field>
          </div>
        )}

        {/* Hidden inputs keep the non-active affiliation branches' fields in the payload as empty strings. */}
        {affiliationType !== "parish" && (
          <>
            <input type="hidden" name="archdiocese" value={parishOptions[0]} />
            <input type="hidden" name="archdioceseOther" value="" />
            <input type="hidden" name="parishName" value="" />
            <input type="hidden" name="parishAddress" value="" />
            <input type="hidden" name="organizationName" value="" />
            <input type="hidden" name="roleInMinistry" value={ministryOptions[0]} />
            <input type="hidden" name="roleInMinistryOther" value="" />
          </>
        )}
        {affiliationType !== "school" && (
          <>
            <input type="hidden" name="province" value="" />
            <input type="hidden" name="schoolName" value="" />
            <input type="hidden" name="schoolAddress" value="" />
            <input type="hidden" name="designation" value={designationOptions[0]} />
            <input type="hidden" name="designationOther" value="" />
          </>
        )}
        {affiliationType !== "neither" && (
          <>
            <input type="hidden" name="companyOrganization" value="" />
            <input type="hidden" name="companyAddress" value="" />
            <input type="hidden" name="positionDesignation" value="" />
          </>
        )}
      </div>
    </>
  );
}
